import fs from "fs";

export type PackageJson = {
  name: string;
  version?: string;
  description?: string;
  license?: string;
  author?: string | { name?: string; email?: string; url?: string };
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  publishMeta: {
    appId: string;
    appName: string;
    copyright: string;
    provider: {
      github: {
        owner: string;
        repositoryName: string;
        private: boolean;
        token: string;
      };
    };
  };
};

export function readPackageJsonFile(path: string) {
  const raw = fs.readFileSync(path, {
    encoding: "utf8",
  });
  return JSON.parse(raw) as PackageJson;
}

export function isNativeModule(packageJson: PackageJson) {
  const NATIVE_BUILD_TOOLS = ["bindings", "node-addon-api", "prebuild", "nan", "node-pre-gyp", "node-gyp-build"];
  if (!packageJson.dependencies && !packageJson.devDependencies) {
    throw new Error('Cannot validate the package since there is no "dependencies" nor "devDependencies"');
  }

  return NATIVE_BUILD_TOOLS.some((tool) => {
    return Reflect.has(packageJson.dependencies ?? {}, tool) || Reflect.has(packageJson.devDependencies ?? {}, tool);
  });
}
