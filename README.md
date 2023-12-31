# tag-file

ClI tool / library to store tags directly in the filenames (ex: `test#foo.txt`).

## Why?

I wanted to tag my files to retrieve them easily on cross platform. I searched a sexy solution like Mac OS has but I didn't find any.

### Here is the list of alternatives I found.

#### Extended attributes

Extended attributes (shortened `xattr`) are used to store metadata of the files. It's a simply key/value storage related to a file or a folder.

Linux supports it with EXT4 or ZFS filsystem and MacOS with HFS+ or APFS. But Windows (with NTFS) does not support it.

Extended attributes is an hackable solution since they can be used thought CLI tools `xattr`. Thus you can easily write them using `setfattr` and read them using `setfattr` [^1].

It doesn't fit my need because:

1. **extended attributes are not saved into the file**. It means that [even `cp` doesn't copy extended attributes when file move to a different storage](https://unix.stackexchange.com/questions/44253/how-to-clone-copy-all-file-directory-attributes-onto-different-file-directory) (apparently you need to use `rsync -X` instead...). TODO verify
2. This is not possible on Android. I tried using [Termux on Android](https://termux.dev/en/) and I got _unsupported error_
3. They are not saved in every cloud provider / FS types [^2]

#### TagSpace

[TagScape](https://www.tagspaces.org/) is a cross-platform open-source software which offer two approach to tags files everywhere.

It offers two way to handle tags:

1. **filename**, The first approach is really simple. If you want to add tag `work` to `foo.txt`, you simply rename your file `foo[work].txt`. That's it. It seems dumb at first but it's not.
2. **sidecar**, The first approach is to add a JSON by the file. So if you want to tag `foo.txt`, TagSpace will create a file `foo.txt.json`.

It doesn't fit me because the filename convention they use is not really hackable for me. It's difficult to find a tag using the search tool in Nautilus for example.

#### Symlinks

A common idea is to use symbolic links to tag your files.

For instance, you create a top level folder `tags/` . if you want to tag your file `foo.txt` as `work`, you simply create a new folder `tags/work` and make a symlink

```
./tags/work/foo.txt -> ./foo.txt
```

It is easy to script using a shell script. But it doesn't work on Android. Also, symlink are weak and may be broken if your rename/move/destroy the original file.

[^1]: Bash script example to read/write EXT4 extended attributes https://bougui505.github.io/2017/09/12/tagging_files_using_ext4_extended_file_attributes.html
[^2]: https://eclecticlight.co/2018/01/12/which-file-systems-and-cloud-services-preserve-extended-attributes/
