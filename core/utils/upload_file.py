import io
import logging

import pandas as pd
from django.contrib import messages
from django.utils.datastructures import MultiValueDictKeyError
from pandas.core.frame import DataFrame

from setup.settings import TEMPORARY_FILE_DIR
from core.utils import clean_folder


def upload_file(request) -> DataFrame:
    try:
        clean_folder()
        file = request.FILES["file"]
        file_is_csv: bool = file.name.endswith(".csv")
        file_is_txt: bool = file.name.endswith(".txt")
        if file_is_csv or file_is_txt:
            file_data: str = file.read().decode("utf-8")
            if file_is_csv:
                df: DataFrame = pd.read_csv(io.StringIO(file_data), sep=",")
            else:
                df: DataFrame = pd.read_csv(
                    io.StringIO(file_data), sep=",", header=None
                )
            df.to_csv(
                f"{TEMPORARY_FILE_DIR}/user_file.csv",
                encoding="utf-8",
                index=False,
            )
            return df
        else:
            messages.error(request, "File should be CSV or TXT type.")
    except MultiValueDictKeyError:
        logging.getLogger("error_logger").error("Please choose file to upload.")
        messages.error(request, "Please choose file to upload.")
    except Exception as e:
        logging.getLogger("error_logger").error("Unable to upload file. " + repr(e))
        messages.error(request, "Unable to upload file. " + repr(e))
