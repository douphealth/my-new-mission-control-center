import { describe, expect, it } from 'vitest';
import { autonomousImport } from '@/lib/importEngine';

describe('Ultra-Smart NLP Import Engine', () => {
  it('imports transposed WordPress website spreadsheet pastes as website records', () => {
    const text = `Site Name\tAffiliatemarketingforsuccess.com\tMysticaldigits.com\tGearuptogrow.com
URL\tAffiliatemarketingforsuccess.com\tMysticaldigits.com\tGearuptogrow.com
WP Admin URL\taffiliatemarketingforsuccess.com/wp-admin\tmysticaldigits.com/wp-admin\tGearuptogrow.com/wp-admin
WP Username\tPapalexios\tAlexios\tAlexios
WP Password\tsecret-1\tsecret-2\tsecret-3
Hosting Provider\tCyberPanel\tCyberPanel\tCyberPanel
Hosting Login URL\t107.173.167.243:8090\t107.173.167.49:8090\t107.173.167.49:8090
Hosting Username\tadmin\tadmin\tadmin
Hosting Password\thost-1\thost-2\thost-3
Category\tBlog\tBlog\tBlog
Status\tActive\tActive\tActive`;

    const result = autonomousImport(text);
    const websites = result.categories.find(category => category.target === 'websites');

    expect(websites?.items).toHaveLength(3);
    expect(websites?.items[0]).toMatchObject({
      name: 'Affiliatemarketingforsuccess.com',
      url: 'https://Affiliatemarketingforsuccess.com',
      wpAdminUrl: 'https://affiliatemarketingforsuccess.com/wp-admin',
      wpUsername: 'Papalexios',
      hostingProvider: 'CyberPanel',
      status: 'active',
      category: 'Blog',
    });
  });

  it('preserves column alignment when transposed website pastes contain empty cells', () => {
    const text = `\tSite A\tSite B\tSite C
Site Name\tAffiliatemarketingforsuccess.com\tMysticaldigits.com\tGearuptogrow.com
URL\tAffiliatemarketingforsuccess.com\t\tGearuptogrow.com
WP Admin URL\taffiliatemarketingforsuccess.com/wp-admin\tmysticaldigits.com/wp-admin\t
WP Username\tPapalexios\tAlexios\tAlexios
WP Password\tsecret-1\t\tsecret-3
Hosting Provider\tCyberPanel\tCyberPanel\tCyberPanel
Hosting Login URL\t107.173.167.243:8090\t107.173.167.49:8090\t107.173.167.49:8090
Hosting Username\tadmin\tadmin\tadmin
Hosting Password\thost-1\thost-2\thost-3
Category\tBlog\tBlog\tBlog
Status\tActive\tActive\tActive`;

    const result = autonomousImport(text);
    const websites = result.categories.find(category => category.target === 'websites');

    expect(websites?.items).toHaveLength(3);
    expect(websites?.items[1]).toMatchObject({
      name: 'Mysticaldigits.com',
      url: 'https://Mysticaldigits.com',
      wpAdminUrl: 'https://mysticaldigits.com/wp-admin',
      wpPassword: '',
      hostingPassword: 'host-2',
    });
    expect(websites?.items[2]).toMatchObject({
      name: 'Gearuptogrow.com',
      url: 'https://Gearuptogrow.com',
      wpAdminUrl: '',
      wpPassword: 'secret-3',
      hostingPassword: 'host-3',
    });
  });
});