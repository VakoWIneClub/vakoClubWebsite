import fs from 'node:fs';
import path from 'node:path';

/**
 * A local run writes test-results/, playwright-report/, allure-results/, and blob-report/ into
 * this folder — pure report/artifact output, nothing worth keeping between runs, but it kept
 * showing up as untracked changes in `git status`. CI needs these left in place so the
 * upload-artifact steps in .github/workflows/playwright.yml can pick them up and merge them
 * across shards, so this only runs locally.
 */
export default async function globalTeardown() {
  if (process.env.CI) return;

  const artifactDirs = ['test-results', 'playwright-report', 'allure-results', 'blob-report'];
  await Promise.all(
    artifactDirs.map((dir) =>
      fs.promises.rm(path.resolve(__dirname, dir), { recursive: true, force: true })
    )
  );
}
