!macro customInit
  ; If a legacy user-mode installation exists in Local AppData, remove it cleanly to avoid conflicts
  ${if} ${FileExists} "$LOCALAPPDATA\Programs\QEVRA\QEVRA.exe"
    DetailPrint "Found legacy per-user QEVRA installation in AppData. Cleaning up..."
    RMDir /r "$LOCALAPPDATA\Programs\QEVRA"
    Delete "$DESKTOP\QEVRA Flow.lnk"
    Delete "$SMPROGRAMS\QEVRA Flow.lnk"
  ${endif}
!macroend

!macro customInstall
  DetailPrint "Configuring Windows Startup for 24/7 background Push-to-Talk..."
  ; Register QEVRA to start with Windows minimized to tray
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "QEVRA" '"$INSTDIR\QEVRA.exe" --hidden'
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Run" "QEVRA" '"$INSTDIR\QEVRA.exe" --hidden'
!macroend

!macro customUninstall
  DetailPrint "Cleaning up QEVRA registry keys and startup..."
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "QEVRA"
  DeleteRegValue HKLM "Software\Microsoft\Windows\CurrentVersion\Run" "QEVRA"
  Delete "$DESKTOP\QEVRA Flow.lnk"
  Delete "$SMPROGRAMS\QEVRA Flow.lnk"
!macroend
