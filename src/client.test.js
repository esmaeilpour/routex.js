import createRouteLinks from './client';

describe('client/createRouteLinks', () => {
  test('return a link() function', () => {
    const routes = [{ name: 'a-route-name' }];

    const { link } = createRouteLinks(routes);

    expect(link).toBeDefined();
  });

  test('throw an error if a route name is not defined', () => {
    const routes = [{ name: 'a-route-name' }, { pattern: '/a-route-pattern' }];

    expect(() => createRouteLinks(routes)).toThrow(
      new Error(`A route name must be defined`),
    );
  });

  test('throw an error if a route name is already defined', () => {
    const duplicatedRouteName = 'a-route-name';
    const routes = [
      { name: duplicatedRouteName },
      { name: duplicatedRouteName },
    ];

    expect(() => createRouteLinks(routes)).toThrow(
      new Error(`This route name is already defined: ${duplicatedRouteName}`),
    );
  });

  describe('link', () => {
    test('throw an error if no route given', () => {
      const { link } = createRouteLinks([]);

      expect(() => link({ route: undefined })).toThrow(
        new Error(`Function link() should have a route name`),
      );
    });

    test('return link props given a route definition with a name', () => {
      const routes = [{ name: 'a-route-name' }];
      const { link } = createRouteLinks(routes);

      const expected = {
        as: '/a-route-name',
        href: '/a-route-name',
      };

      expect(
        link({
          route: 'a-route-name',
        }),
      ).toEqual(expected);
    });

    test('return link props given a route definition with a name and pattern', () => {
      const routes = [{ name: 'a-route-name', pattern: '/a-route-pattern' }];
      const { link } = createRouteLinks(routes);

      const expected = {
        as: '/a-route-pattern',
        href: '/a-route-name',
      };

      expect(
        link({
          route: 'a-route-name',
        }),
      ).toEqual(expected);
    });

    test('return link props given a route definition with a name, pattern and page', () => {
      const routes = [
        {
          name: 'a-route-name',
          pattern: '/a-route-pattern',
          page: '/a-route-page',
        },
      ];
      const { link } = createRouteLinks(routes);

      const expected = {
        as: '/a-route-pattern',
        href: '/a-route-page',
      };

      expect(
        link({
          route: 'a-route-name',
        }),
      ).toEqual(expected);
    });

    test('link properties should not have more than one starting slash', () => {
      const routes = [
        {
          name: 'a-route-name',
          pattern: '/a-route-pattern',
          page: '/a-route-page',
        },
      ];
      const { link } = createRouteLinks(routes);

      const expected = {
        as: '/a-route-pattern',
        href: '/a-route-page',
      };

      expect(
        link({
          route: 'a-route-name',
        }),
      ).toEqual(expected);
    });

    test('link "as" property should be a slash when route definition name is equal to "index"', () => {
      const routes = [{ name: 'index' }];
      const { link } = createRouteLinks(routes);

      const expected = {
        as: '/',
        href: '/index',
      };

      expect(
        link({
          route: 'index',
        }),
      ).toEqual(expected);
    });

    test('return link props with a matched route definition', () => {
      const routes = [
        {
          name: 'a-route-name',
          pattern: '/a-route-pattern',
          page: '/a-route-page',
        },
        {
          name: 'another-route-name',
          pattern: '/another-route-pattern',
          page: '/another-route-page',
        },
      ];
      const { link } = createRouteLinks(routes);

      const expected = {
        as: '/another-route-pattern',
        href: '/another-route-page',
      };

      expect(
        link({
          route: 'another-route-name',
        }),
      ).toEqual(expected);
    });

    test('return link props with a resolved route pattern params', () => {
      const routes = [
        {
          name: 'a-route-name',
          pattern: '/a-route-pattern-with-:lang',
          page: '/a-route-page',
        },
      ];
      const { link } = createRouteLinks(routes);

      const expected = {
        as: '/a-route-pattern-with-javascript',
        href: '/a-route-page?lang=javascript',
      };

      expect(
        link({
          route: 'a-route-name',
          params: { lang: 'javascript' },
        }),
      ).toEqual(expected);
    });

    test('return link props with a resolved params and extra passed query params', () => {
      const routes = [
        {
          name: 'a-route-name',
          pattern: '/a-route-pattern-with-:lang',
          page: '/a-route-page',
        },
      ];
      const { link } = createRouteLinks(routes);

      const expected = {
        as: '/a-route-pattern-with-javascript',
        href:
          '/a-route-page?lang=javascript&extra=extra-query-param&extraArray=first-param%2Fsecond-param',
      };

      expect(
        link({
          route: 'a-route-name',
          params: {
            lang: 'javascript',
            extra: 'extra-query-param',
            extraArray: ['first-param', 'second-param'],
          },
        }),
      ).toEqual(expected);
    });

    test('return link props with a resolved optional route pattern params', () => {
      const routes = [
        {
          name: 'a-route-name',
          pattern: '/a-route-pattern-with{-:optionalLang}?',
          page: '/a-route-page',
        },
      ];
      const { link } = createRouteLinks(routes);

      const expected = {
        as: '/a-route-pattern-with',
        href: '/a-route-page',
      };

      expect(
        link({
          route: 'a-route-name',
          params: { lang: undefined },
        }),
      ).toEqual(expected);
    });

    test('throw an error if a route name given to link() is not defined in routes manifest', () => {
      const routes = [];
      const { link } = createRouteLinks(routes);
      const routeName = 'not-existing-route';

      expect(() => link({ route: routeName })).toThrow(
        new Error(
          `Route name "${routeName}" is not defined in your route definitions`,
        ),
      );
    });
  });
});
