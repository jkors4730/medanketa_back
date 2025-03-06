
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  resolver: 'ts-jest-resolver',
  extensionsToTreatAsEsm: ['.ts'],
  transform : {
    '^.+\\.tsx?$' : [
      'ts-jest' ,
      {
        diagnostics : {
          ignoreCodes : [ 1343 ]
        } ,
        astTransformers : {
          before : [
            {
              path : 'ts-jest-mock-import-meta' ,   // или, в качестве альтернативы, 'ts-jest-mock-import-meta' напрямую, без node_modules.
            }
          ]
        }
      }
    ]
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testMatch: ['**/test/**/*.test.ts'],
};

export default config;
