$null = Add-Type @"
  using System;
  using System.Runtime.InteropServices;
  public class User32Helper {
    [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
    [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);
  }
"@ -ErrorAction SilentlyContinue

$hwnd = [User32Helper]::GetForegroundWindow()
$pidVal = [uint32]0
$null = [User32Helper]::GetWindowThreadProcessId($hwnd, [ref]$pidVal)

if ($pidVal -gt 0) {
  $proc = Get-Process -Id $pidVal -ErrorAction SilentlyContinue
  if ($proc) {
    [PSCustomObject]@{
      ProcessName = $proc.ProcessName
      MainWindowTitle = $proc.MainWindowTitle
    } | ConvertTo-Json -Compress
  } else {
    '{}'
  }
} else {
  '{}'
}
