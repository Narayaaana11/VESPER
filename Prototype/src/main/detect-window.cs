using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Text;

class Program {
    [DllImport("user32.dll")]
    static extern IntPtr GetForegroundWindow();

    [DllImport("user32.dll", SetLastError = true)]
    static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

    static void Main() {
        try {
            IntPtr hwnd = GetForegroundWindow();
            if (hwnd == IntPtr.Zero) {
                Console.WriteLine("{}");
                return;
            }

            uint pid = 0;
            GetWindowThreadProcessId(hwnd, out pid);
            if (pid == 0) {
                Console.WriteLine("{}");
                return;
            }

            Process proc = Process.GetProcessById((int)pid);
            StringBuilder title = new StringBuilder(512);
            GetWindowText(hwnd, title, 512);

            string pName = (proc.ProcessName ?? "").Replace("\\", "\\\\").Replace("\"", "\\\"");
            string wTitle = (title.ToString() ?? "").Replace("\\", "\\\\").Replace("\"", "\\\"");

            Console.WriteLine("{{\"ProcessName\":\"{0}\",\"MainWindowTitle\":\"{1}\",\"Hwnd\":{2}}}", pName, wTitle, hwnd.ToInt64());
        } catch {
            Console.WriteLine("{}");
        }
    }
}
