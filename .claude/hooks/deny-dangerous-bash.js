// PreToolUse hook (matcher: Bash). Blocks a fixed set of dangerous command
// patterns regardless of where they appear in a compound command
// (after &&, ;, |, ||), since permission-list prefix matching alone can't
// reliably express "contains X anywhere" or "curl piped into a shell".
let raw = "";
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  let cmd = "";
  try {
    cmd = JSON.parse(raw).tool_input?.command ?? "";
  } catch {
    // no valid input JSON; nothing to check
  }

  const rules = [
    {
      re: /(^|[;&|\s])rm\s+(-[a-zA-Z]*r[a-zA-Z]*f[a-zA-Z]*|-[a-zA-Z]*f[a-zA-Z]*r[a-zA-Z]*)(\s|$)/i,
      reason: "rm -rf 계열 명령은 차단됩니다.",
    },
    {
      re: /(^|[;&|\s])sudo(\s|$)/i,
      reason: "sudo 명령은 차단됩니다.",
    },
    {
      re: /(^|[;&|\s])chmod\s+(-[a-zA-Z]+\s+)?777(\s|$)/i,
      reason: "chmod 777 명령은 차단됩니다.",
    },
    {
      // curl/wget output piped straight into a shell interpreter
      re: /(curl|wget)[^;&|]*[;&|]+[^;&|]*(sudo\s+)?\b(sh|bash|zsh|dash)\b(\s|$)/i,
      reason: "curl/wget로 받은 스크립트를 파이프로 바로 실행하는 명령은 차단됩니다.",
    },
    {
      // ... via process substitution: bash <(curl ...)
      re: /\b(sh|bash|zsh|dash)\b\s+<\([^)]*\b(curl|wget)\b/i,
      reason: "curl/wget로 받은 스크립트를 프로세스 치환으로 바로 실행하는 명령은 차단됩니다.",
    },
    {
      // ... via command substitution: sh -c "$(curl ...)"
      re: /\b(sh|bash|zsh|dash)\b\s+-c\s+.*\$\([^)]*\b(curl|wget)\b/i,
      reason: "curl/wget로 받은 스크립트를 커맨드 치환으로 바로 실행하는 명령은 차단됩니다.",
    },
  ];

  for (const { re, reason } of rules) {
    if (re.test(cmd)) {
      console.log(
        JSON.stringify({
          hookSpecificOutput: {
            hookEventName: "PreToolUse",
            permissionDecision: "deny",
            permissionDecisionReason: reason,
          },
        })
      );
      return;
    }
  }

  console.log("{}");
});
