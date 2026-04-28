// lib/task-queue.ts
// Browser-only task queue for batch processing with concurrency control

import PQueue from 'p-queue';

export interface TaskContext {
  signal: AbortSignal;
}

export interface TaskDefinition<TInput, TOutput> {
  id: string;
  input: TInput;
  run: (input: TInput, ctx: TaskContext) => Promise<TOutput>;
}

export interface TaskQueueOptions {
  concurrency?: number;
}

export class TaskQueue<TInput = unknown, TOutput = unknown> {
  private readonly queue: PQueue;
  private readonly controllers = new Map<string, AbortController>();

  constructor(options: TaskQueueOptions = {}) {
    this.queue = new PQueue({ concurrency: options.concurrency ?? 4 });
  }

  get size() {
    return this.queue.size;
  }

  get pending() {
    return this.queue.pending;
  }

  async add(task: TaskDefinition<TInput, TOutput>): Promise<TOutput> {
    const controller = new AbortController();
    this.controllers.set(task.id, controller);

    try {
      const result = await this.queue.add(() => task.run(task.input, { signal: controller.signal }));
      this.controllers.delete(task.id);
      return result as TOutput;
    } catch (error) {
      this.controllers.delete(task.id);
      throw error;
    }
  }

  cancel(taskId: string) {
    const controller = this.controllers.get(taskId);
    if (controller) {
      controller.abort();
      this.controllers.delete(taskId);
    }
  }

  clear() {
    this.queue.clear();
    this.controllers.forEach((controller) => controller.abort());
    this.controllers.clear();
  }
}

export const createTaskId = () => `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
