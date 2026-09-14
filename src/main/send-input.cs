using System;
using System.Runtime.InteropServices;
using System.Threading;

class Program {
    [DllImport("user32.dll")]
    static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, UIntPtr dwExtraInfo);

    [DllImport("user32.dll")]
    static extern IntPtr GetForegroundWindow();

    [DllImport("user32.dll")]
    static extern uint GetWindowThreadProcessId(IntPtr hWnd, IntPtr ProcessId);

    [DllImport("user32.dll")]
    static extern bool AttachThreadInput(uint idAttach, uint idAttachTo, bool fAttach);

    [DllImport("kernel32.dll")]
    static extern uint GetCurrentThreadId();

    [DllImport("user32.dll")]
    static extern bool SetForegroundWindow(IntPtr hWnd);

    [DllImport("user32.dll")]
    static extern bool BringWindowToTop(IntPtr hWnd);

    const int KEYEVENTF_KEYDOWN = 0x0000;
    const int KEYEVENTF_KEYUP = 0x0002;
    const byte VK_CONTROL = 0x11;
    const byte VK_V = 0x56;

    static void Main(string[] args) {
        try {
            long hwndVal = 0;
            if (args.Length > 0 && long.TryParse(args[0], out hwndVal) && hwndVal != 0) {
                IntPtr targetHwnd = new IntPtr(hwndVal);
                IntPtr foreHwnd = GetForegroundWindow();
                if (foreHwnd != targetHwnd) {
                    uint foreThread = GetWindowThreadProcessId(foreHwnd, IntPtr.Zero);
                    uint curThread = GetCurrentThreadId();
                    AttachThreadInput(curThread, foreThread, true);
                    SetForegroundWindow(targetHwnd);
                    BringWindowToTop(targetHwnd);
                    AttachThreadInput(curThread, foreThread, false);
                    Thread.Sleep(80);
                } else {
                    Thread.Sleep(50);
                }
            } else {
                Thread.Sleep(50);
            }

            // Simulate Ctrl+V with hold duration so apps process the message
            keybd_event(VK_CONTROL, 0, KEYEVENTF_KEYDOWN, UIntPtr.Zero);
            keybd_event(VK_V, 0, KEYEVENTF_KEYDOWN, UIntPtr.Zero);
            Thread.Sleep(25);
            keybd_event(VK_V, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
            keybd_event(VK_CONTROL, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);

            Console.WriteLine("{\"success\":true,\"method\":\"native_keybd_event\"}");
        } catch (Exception ex) {
            Console.WriteLine("{{\"success\":false,\"error\":\"{0}\"}}", ex.Message);
        }
    }
}
