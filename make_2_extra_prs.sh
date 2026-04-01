#!/bin/bash
set -e

# Setup git config
git config user.name "euxaristia"
git config user.email "25621994+euxaristia@users.noreply.github.com"

# Base for all PRs
BASE_BRANCH="upstream/main"

# 9. Clipboard paste unhandled rejection
git checkout -B fix/clipboard-paste-unhandled-rejection $BASE_BRANCH
git checkout 908149b46 -- packages/cli/src/ui/components/InputPrompt.tsx
git commit -m "fix(cli): add catch block to handleClipboardPaste to prevent unhandled rejections" --no-verify
git push -u origin fix/clipboard-paste-unhandled-rejection -f
gh pr create --repo google-gemini/pollux-cli --title "fix(cli): prevent unhandled rejections during clipboard paste" --body "Ensures that errors during clipboard reading (common on Wayland with empty clipboards) are caught and logged rather than triggering a global unhandled rejection." --head "euxaristia:fix/clipboard-paste-unhandled-rejection" --base main

# 10. Global unhandled rejection improvements (AbortError + TimeoutError)
git checkout -B fix/unhandled-rejection-suppression $BASE_BRANCH
git checkout 908149b46 -- packages/core/src/utils/errors.ts packages/cli/src/gemini.tsx
git commit -m "fix(cli): suppress unhandled TimeoutError logs in addition to AbortError" --no-verify
git push -u origin fix/unhandled-rejection-suppression -f
gh pr create --repo google-gemini/pollux-cli --title "fix(cli): suppress unhandled TimeoutError and AbortError logs" --body "Fixes #22613. Updates the global unhandled rejection handler to suppress both AbortError and TimeoutError, which are expected in many streaming scenarios and shouldn't be treated as critical crashes." --head "euxaristia:fix/unhandled-rejection-suppression" --base main

