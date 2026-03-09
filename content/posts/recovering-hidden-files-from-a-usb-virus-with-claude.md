+++
title = "Recovering Hidden Files from a USB Virus with Claude Code"
date = 2026-03-09T10:00:00+05:30
description = "How I used Claude Code to recover precious family videos hidden on a pen drive by a USB virus — without losing a single file."
tags = ["claude", "ai", "terminal", "recovery", "tutorial"]
slug = "recovering-hidden-files-from-a-usb-virus-with-claude"
draft = false
+++

My pen drive looked completely empty. A file browser showed nothing. But the storage info said 11 GB was in use.

The drive is labeled **PHOTOS**. On it was the only recording we have of my grandparents' 50th wedding anniversary celebration. My grandmother has since passed away. That video is the only footage we have of her.

I had lost all hope we would ever get it back.

The files were still there. A virus had hidden them. And Claude Code helped me find them.

## How It Got Corrupted

Our family has a 10-year-old TV that we plug pen drives into to watch videos. Somehow, any device connected to that TV was getting corrupted. I had used PHOTOS with it, and the next time I plugged the drive into my Mac, it appeared empty.

The pen drive had picked up a classic USB virus. This type of malware does not encrypt or delete your files. It hides them by moving everything into a folder whose name is designed to be invisible.

In this case, the folder name was a single Unicode non-breaking space character: **U+00A0**, encoded in UTF-8 as the byte sequence `\xc2\xa0`. To any file browser, that folder simply does not appear. Your files are inside it, perfectly intact, silently waiting.

The malware also drops a few artifacts of its own:

- `desktop.ini` — a Windows autorun file that helps the virus re-execute itself
- A binary with a long garbled filename — the virus executable itself, around 7 MB

The pen drive was 15.6 GB formatted as FAT32. About 11 GB was "missing."

## How Claude Code Helped

I described the problem to Claude Code in plain English: a pen drive that appears empty but shows 11 GB used. Claude walked me through a precise sequence of terminal commands to diagnose and fix it, explaining what each step was doing and why.

This is what made the difference. I could have searched for answers across a dozen Stack Overflow threads and forum posts. Instead, I described my exact situation once, and Claude gave me a tailored step-by-step plan specific to my drive, my filesystem, and my Mac.

## Step 1: Identify the Drive

```bash
diskutil list external
```

This listed all external disks. PHOTOS showed up at `/dev/disk2` — a 15.6 GB FAT32 volume mounted at `/Volumes/PHOTOS`.

## Step 2: Confirm the Drive Looked Empty

```bash
ls -la /Volumes/PHOTOS/
```

The output showed only system-level folders like `.Spotlight-V100` and `.fseventsd`. No user files. From the outside, the drive was empty.

## Step 3: Confirm the Space Was Still Used

```bash
df -h /Volumes/PHOTOS
```

This showed 11 GB used out of 15.6 GB. The files had not been deleted. They were somewhere on the drive, just hidden.

## Step 4: Find Every File Regardless of Folder Name

```bash
find /Volumes/PHOTOS/ -type f
```

This recursively listed every file on the drive without caring about hidden attributes or invisible folder names. Files started appearing: `.mp4` videos, `.jpg` photos, `.VOB` DVD files. They were all in a folder whose name looked like a blank space in the terminal output.

## Step 5: Pinpoint the Hidden Folder

```bash
du -sh /Volumes/PHOTOS/*/
```

This measured disk usage per top-level directory. One entry — the invisible-named folder — reported 11 GB. That confirmed exactly where everything was hiding.

## Step 6: Decode the Folder Name

Claude suggested inspecting the raw bytes of the directory listing to identify the invisible character:

```bash
ls /Volumes/PHOTOS/ | xxd
```

The `xxd` output showed `c2 a0` — the UTF-8 encoding of U+00A0, the non-breaking space. That was the folder name. A single invisible character, invisible to every file browser, but perfectly real on disk.

## Step 7: List the Hidden Files

Now that the exact byte sequence was known, the hidden folder could be accessed directly:

```bash
ls -la "$(printf '/Volumes/PHOTOS/\xc2\xa0')"
```

Everything appeared:

| File | Size |
|------|------|
| 50th Anniversary Celebration.mp4 | 112 MB |
| Family Trip 1.mp4 | 1.0 GB |
| Family Trip 2.mp4 | 1.9 GB |
| Anniversary video/ (5 VOB files) | DVD video |
| photos/ (1,115 photos from July 2018) | — |

I stared at that list for a moment. Every file was there.

## Step 8: Copy Everything to Safety

```bash
cp -Rv "$(printf '/Volumes/PHOTOS/\xc2\xa0')" ~/Desktop/PHOTOS_backup/
```

The `-R` flag copies directories recursively. The `-v` flag prints each file as it copies so you can watch the progress and confirm nothing is missed. I watched each filename scroll past. Every file transferred successfully.

## Step 9: Format the Drive Clean

With all files safely backed up, the last step was to wipe the pen drive completely to remove the malware:

```bash
diskutil eraseDisk FAT32 PHOTOS MBRFormat /dev/disk2
```

This reformatted the drive as FAT32 with an MBR partition table — the same format it had before, compatible with both Windows and Mac. All virus artifacts were gone. The drive is safe to use again.

## What Made This Work

A few things came together here:

**The virus did not delete anything.** It only hid files. That is actually the common behavior for this class of USB malware — it wants to stay invisible, not destroy data. So recovery was always possible.

**The files were on a FAT32 drive.** FAT32 does not have complex permissions or encryption. If the bytes are on disk and the filesystem is intact, you can reach them with the right path.

**Claude knew what to look for.** When I described the symptoms — drive appears empty, storage shows 11 GB used — Claude immediately identified USB virus hiding as a likely cause, explained the non-breaking space trick, and knew exactly which tools would reveal and access the hidden folder. I did not have to piece this together from scratch.

The entire recovery took about 20 minutes from "the drive looks empty" to "all files are on my Desktop."

## Lessons Learned

**Old TVs and shared devices can be infection vectors.** I did not think twice about plugging PHOTOS into our family TV. Now I know to treat shared devices the same way I would treat an unknown USB port at a hotel.

**A drive that looks empty is not always empty.** If your storage stats do not match what you see, something is hidden — not deleted. Do not reformat. Investigate first.

**You do not need to be a terminal expert.** I had Claude explain each command before running it. Understanding what you are doing matters, especially when you are working with raw disk operations. Claude made that accessible.

**Back up irreplaceable files immediately.** The 50th anniversary video, the family trip diaries, 1,115 photos from 2018 — none of it had a second copy. It does now.

---

My grandmother passed away after that anniversary celebration. That video is the only footage we have of her at that milestone. We nearly lost it to a piece of malware that cost us nothing to remove.

That is the thing about this kind of virus: it looks catastrophic but it is not. The data is there. You just need to know where to look.

I am glad Claude did.
