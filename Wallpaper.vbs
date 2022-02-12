Dim WinScriptHost
Set WinScriptHost = CreateObject("WScript.Shell")
WinScriptHost.Run Chr(34) & "C:\Program Files\nodejs\node.exe" & Chr(34) & "D:\www\random-wallpaper\main.js" & Chr(34), 0
Set WinScriptHost = Nothing