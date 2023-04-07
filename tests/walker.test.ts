import { walker } from '@/walker';

describe('dependency walker', () => {
  it('returns an Iterator', () => {
    const walking = walker({
      dependencies: {
        foo: {
          from: 'foo',
          version: '1.0.0',
          resolved: 'https://registry.npmjs.org/foo/-/foo-1.0.0.tgz',
          path: 'node_modules/foo',
        },
      },
    });
    expect(typeof walking.next).toBe('function');
    expect(typeof walking[Symbol.iterator]).toBe('function');
    expect(walking[Symbol.iterator]()).toBe(walking);
  });
  it('yields a tuple of [packageName, version]', () => {
    const walking = walker({
      dependencies: {
        foo: {
          from: 'foo',
          version: '1.0.0',
          resolved: 'https://registry.npmjs.org/foo/-/foo-1.0.0.tgz',
          path: 'node_modules/foo',
        },
      },
    });
    expect(walking.next()).toEqual({
      done: false,
      value: ['foo', '1.0.0'],
    });
    expect(walking.next()).toEqual({
      done: true,
      value: undefined,
    });
  });
  it('yields sibling dependencies', () => {
    const walking = walker({
      dependencies: {
        foo: {
          from: 'foo',
          version: '1.0.0',
          resolved: 'https://registry.npmjs.org/foo/-/foo-1.0.0.tgz',
          path: 'node_modules/foo',
        },
        bar: {
          from: 'bar',
          version: '2.0.0',
          resolved: 'https://registry.npmjs.org/bar/-/bar-2.0.0.tgz',
          path: 'node_modules/bar',
        },
      },
    });
    expect(walking.next()).toEqual({
      done: false,
      value: ['foo', '1.0.0'],
    });
    expect(walking.next()).toEqual({
      done: false,
      value: ['bar', '2.0.0'],
    });
    expect(walking.next()).toEqual({
      done: true,
      value: undefined,
    });
  });
  it('yields nested dependencies', () => {
    const walking = walker({
      dependencies: {
        foo: {
          from: 'foo',
          version: '1.0.0',
          resolved: 'https://registry.npmjs.org/foo/-/foo-1.0.0.tgz',
          path: 'node_modules/foo',
          dependencies: {
            bar: {
              from: 'bar',
              version: '2.0.0',
              resolved: 'https://registry.npmjs.org/bar/-/bar-2.0.0.tgz',
              path: 'node_modules/foo/node_modules/bar',
            },
          },
        },
      },
    });
    expect(walking.next()).toEqual({
      done: false,
      value: ['foo', '1.0.0'],
    });
    expect(walking.next()).toEqual({
      done: false,
      value: ['bar', '2.0.0'],
    });
    expect(walking.next()).toEqual({
      done: true,
      value: undefined,
    });
  });
  it('yields deps and devDeps', () => {
    const walking = walker({
      dependencies: {
        foo: {
          from: 'foo',
          version: '1.0.0',
          resolved: 'https://registry.npmjs.org/foo/-/foo-1.0.0.tgz',
          path: 'node_modules/foo',
        },
      },
      devDependencies: {
        bar: {
          from: 'bar',
          version: '2.0.0',
          resolved: 'https://registry.npmjs.org/bar/-/bar-2.0.0.tgz',
          path: 'node_modules/bar',
        },
      },
    });
    expect(walking.next()).toEqual({
      done: false,
      value: ['foo', '1.0.0'],
    });
    expect(walking.next()).toEqual({
      done: false,
      value: ['bar', '2.0.0'],
    });
    expect(walking.next()).toEqual({
      done: true,
      value: undefined,
    });
  });
  it('yields sibling, nested, and dev deps', () => {
    const walking = walker({
      dependencies: {
        foo: {
          from: 'foo',
          version: '1.0.0',
          resolved: 'https://registry.npmjs.org/foo/-/foo-1.0.0.tgz',
          path: 'node_modules/foo',
          dependencies: {
            bar: {
              from: 'bar',
              version: '2.0.0',
              resolved: 'https://registry.npmjs.org/bar/-/bar-2.0.0.tgz',
              path: 'node_modules/foo/node_modules/bar',
            },
            baz: {
              from: 'baz',
              version: '3.0.0',
              resolved: 'https://registry.npmjs.org/baz/-/baz-3.0.0.tgz',
              path: 'node_modules/baz',
              dependencies: {
                foo: {
                  from: 'foo',
                  version: '1.0.0',
                  resolved: 'https://registry.npmjs.org/foo/-/foo-1.0.0.tgz',
                  path: 'node_modules/foo',
                  dependencies: {
                    bar: {
                      from: 'bar',
                      version: '2.0.0',
                      resolved:
                        'https://registry.npmjs.org/bar/-/bar-2.0.0.tgz',
                      path: 'node_modules/foo/node_modules/bar',
                    },
                  },
                },
              },
            },
          },
          devDependencies: {
            baz: {
              from: 'baz',
              version: '3.0.0',
              resolved: 'https://registry.npmjs.org/baz/-/baz-3.0.0.tgz',
              path: 'node_modules/baz',
              dependencies: {
                foo: {
                  from: 'foo',
                  version: '1.0.0',
                  resolved: 'https://registry.npmjs.org/foo/-/foo-1.0.0.tgz',
                  path: 'node_modules/foo',
                  dependencies: {
                    bar: {
                      from: 'bar',
                      version: '2.0.0',
                      resolved:
                        'https://registry.npmjs.org/bar/-/bar-2.0.0.tgz',
                      path: 'node_modules/foo/node_modules/bar',
                    },
                  },
                },
              },
            },
          },
        },
      },
      devDependencies: {
        baz: {
          from: 'baz',
          version: '3.0.0',
          resolved: 'https://registry.npmjs.org/baz/-/baz-3.0.0.tgz',
          path: 'node_modules/baz',
          dependencies: {
            foo: {
              from: 'foo',
              version: '1.0.0',
              resolved: 'https://registry.npmjs.org/foo/-/foo-1.0.0.tgz',
              path: 'node_modules/foo',
              dependencies: {
                bar: {
                  from: 'bar',
                  version: '2.0.0',
                  resolved: 'https://registry.npmjs.org/bar/-/bar-2.0.0.tgz',
                  path: 'node_modules/foo/node_modules/bar',
                },
              },
            },
          },
        },
      },
    });
    const pkgs = [
      ['foo', '1.0.0'],
      ['bar', '2.0.0'],
      ['baz', '3.0.0'],
    ];
    for (let i = 0; i < pkgs.length * 4 - 1; i++)
      expect(walking.next()).toEqual({
        done: false,
        value: pkgs[i % pkgs.length],
      });
    expect(walking.next()).toEqual({
      done: true,
      value: undefined,
    });
  });
});
