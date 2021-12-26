set path="C:\Program Files\WinRAR\";"c:\Program Files (x86)\WinSCP\";%path%
call electron-packager ./electron-quick-start resticgui --platform=win32 --arch=x64 --overwrite
del resticgui-win32-x64.exe
winrar a -s -sfx -m5 resticgui-win32-x64.exe  resticgui-win32-x64

