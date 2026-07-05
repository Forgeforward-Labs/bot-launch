import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "src/graphql/schema.graphql",
  documents: ["src/graphql/**/*.graphql"],
  generates: {
    "src/graphql/__generated__/types-and-hooks.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        withHooks: true,
        // This avoid all generated schemas being wrapped in Maybe https://the-guild.dev/graphql/codegen/plugins/typescript/typescript#maybevalue-string-default-value-t--null
        maybeValue: "T",
        // Map BigInt scalar to string for TypeScript
        scalars: {
          BigInt: "string",
        },
      },
    },
  },
};

export default config;
