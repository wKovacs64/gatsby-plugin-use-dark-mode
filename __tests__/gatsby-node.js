import { testPluginOptionsSchema } from 'gatsby-plugin-utils';
import { pluginOptionsSchema } from '../gatsby-node';

describe('plugin options schema', () => {
  it('accepts valid options', async () => {
    const options = {
      classNameDark: 'dark',
      classNameLight: 'light',
      storageKey: 'theme',
      minify: false,
    };

    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema,
      options,
    );

    expect(isValid).toBe(true);
    expect(errors).toEqual([]);
  });

  it('rejects extra options', async () => {
    const options = {
      classNameDark: 'dark',
      classNameLight: 'light',
      storageKey: 'theme',
      minify: false,
      tinyOrPickle: 'pickle',
    };

    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema,
      options,
    );

    expect(isValid).toBe(false);
    expect(errors).toMatchInlineSnapshot(`
      Array [
        "\\"tinyOrPickle\\" is not allowed",
      ]
    `);
  });

  it('rejects invalid option types', async () => {
    const options = {
      classNameDark: 1,
      classNameLight: 2,
      storageKey: 3,
      minify: 4,
    };

    const { isValid, errors } = await testPluginOptionsSchema(
      pluginOptionsSchema,
      options,
    );

    expect(isValid).toBe(false);
    expect(errors).toMatchInlineSnapshot(`
      Array [
        "\\"classNameDark\\" must be a string",
        "\\"classNameLight\\" must be a string",
        "\\"storageKey\\" must be a string",
        "\\"minify\\" must be a boolean",
      ]
    `);
  });
});
