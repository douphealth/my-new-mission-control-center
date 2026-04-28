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

  it('keeps a 9-site WordPress credential paste as a single websites import', () => {
    const text = `Site Name\tAffiliatemarketingforsuccess.com\tMysticaldigits.com\tGearuptogrow.com\tFrenchyFab.com\tPlantastichaven.com\tGearuptofit.com\tMicegoneguide.com\tEfficientGPTPrompts.com\tOutdoormisting.com
URL\tAffiliatemarketingforsuccess.com\tMysticaldigits.com\tGearuptogrow.com\tFrenchyFab.com\tPlantastichaven.com\tGearuptofit.com\tMicegoneguide.com\tEfficientGPTPrompts.com\tOutdoormisting.com
WP Admin URL\taffiliatemarketingforsuccess.com/wp-admin\tmysticaldigits.com/wp-admin\tGearuptogrow.com/wp-admin\thttps://frenchyfab.com/wp-admin\tplantastichaven.com/wp-admin\tgearuptofit.com/wp-admin\tmicegoneguide.com/wp-admin\thttps://efficientgptprompts.com/wp-admin/\thttps://outdoormisting.com/wp-admin
WP Username\tPapalexios\tAlexios\tAlexios\tAlexios\trcae8os54ukc\tadmin\tmicegoneguide\tAlexios\tAlex
WP Password\tW$eH(57JxSxKlWa7H1VK(vv#\t5feaz79aeay)Ni4u6@0puuJL\tvdn)vlzUP3j!$MRiBD*YM8cw\tbjPxf6Jy4!^6QONw0yQBFh2h\tEh$tqG^Om7ZN8)jUC6&y5w%G\t99d(J@%aVil@$dbkkv!ke8Fd\t3Uij&$xyH^FIV6Tj8TYpvcd*\t8hd!PSP4NW&%UevGug0pEiK$\tFoLMAB2jeH*iYW*d519XE1pY
Hosting Provider\tCyberPanel\tCyberPanel\tCyberPanel\tCyberPanel\tCyberPanel\tCyberPanel\tCyberPanel\tCyberPanel\tCyberPanel
Hosting Login URL\t107.173.167.243:8090\t107.173.167.49:8090\t107.173.167.49:8090\t107.173.167.3:8090\t107.173.167.3:8090\t104.168.100.41:8090\t104.168.100.41:8090\t104.168.100.41:8090\t104.168.100.41:8090
Hosting Username\tadmin\tadmin\tadmin\tadmin\tadmin\tadmin\tadmin\tadmin\tpapalexios001@gmail.com
Hosting Password\t^&*)%!@#Alex1973&(%$@#\t~#@!*&)#Alex1973*~!_+%$#\t~#@!*&)#Alex1973*~!_+%$#\t)(*$%@&*Alex1973*&%$@_!~\t)(*$%@&*Alex1973*&%$@_!~\t^!%@$#Alex1973(~*^@!\t*&)&#$&%Alex1973^%#!@\t~@!#)+&Alex1973+~#!&*(@*\t~@!#)+&Alex1973+~#!&*(@*
Category\tBlog\tBlog\tBlog\tBlog\tBlog\tBlog\tBlog\tBlog\tBlog
Status\tActive\tActive\tActive\tActive\tActive\tActive\tActive\tActive\tActive
email\tpapalexios@gmail.com\tpapalexios@gmail.com\tpapalexios@gmail.com\tpapalexios@gmail.com\tpapalexios@gmail.com\tpapalexios@gmail.com\tadmin@micegoneguide.com\tpapalexios001@gmail.com\tpapalexios01@gmail.com`;

    const result = autonomousImport(text);

    expect(result.categories).toHaveLength(1);
    expect(result.categories[0]?.target).toBe('websites');
    expect(result.categories[0]?.items).toHaveLength(9);
    expect(result.categories[0]?.items[7]).toMatchObject({
      name: 'EfficientGPTPrompts.com',
      url: 'https://EfficientGPTPrompts.com',
      wpAdminUrl: 'https://efficientgptprompts.com/wp-admin/',
      hostingPassword: '~@!#)+&Alex1973+~#!&*(@*',
    });
  });
});