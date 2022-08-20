import os
import glob

from setup.settings import TEMPORARY_FILE_DIR


def clean_folder():
    files = glob.glob(f"{TEMPORARY_FILE_DIR}/*")
    print("FILES", files)
    for f in files:
        print("FILE", f)
        os.remove(f)
        print("FILE REMOVED")
