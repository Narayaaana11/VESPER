!macro customInit
  ; If a legacy user-mode installation exists in Local AppData, remove it cleanly to avoid conflicts
  ${if} ${FileExists} "$LOCALAPPDATA\Programs\VESPER\VESPER.exe"
    DetailPrint "Found legacy per-user VESPER installation in AppData. Cleaning up..."
    RMDir /r "$LOCALAPPDATA\Programs\VESPER"
    Delete "$DESKTOP\VESPER Flow.lnk"
    Delete "$SMPROGRAMS\VESPER Flow.lnk"
  ${endif}
!macroend

!macro customInstall
  DetailPrint "Configuring Windows Startup for 24/7 background Push-to-Talk..."
  ; Register VESPER to start with Windows minimized to tray
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "VESPER" '"$INSTDIR\VESPER.exe" --hidden'
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Run" "VESPER" '"$INSTDIR\VESPER.exe" --hidden'
!macroend

!macro customUninstall
  DetailPrint "Cleaning up VESPER registry keys and startup..."
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "VESPER"
  DeleteRegValue HKLM "Software\Microsoft\Windows\CurrentVersion\Run" "VESPER"
  Delete "$DESKTOP\VESPER Flow.lnk"
  Delete "$SMPROGRAMS\VESPER Flow.lnk"
!macroend
