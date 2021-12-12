#!/usr/bin/env bash
ENV_FILE="../.env"
ENV_EXAMPLE_FILE="../.env.example"
cp "$ENV_FILE" "$ENV_EXAMPLE_FILE"
sed -i "s/\('\).*\('\)/\1\2/" "$ENV_EXAMPLE_FILE"

echo 'Updated .env.example:'
cat "$ENV_EXAMPLE_FILE"

git commit "$ENV_EXAMPLE_FILE" -m "Update env example"
