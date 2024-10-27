FROM python:3.12-bookworm

ENV PYTHONUNBUFFERED 1

COPY requirements/requirements.txt /tmp/requirements.txt
COPY requirements/requirements.dev.txt /tmp/requirements.dev.txt

WORKDIR /src
ARG DEV=false
RUN apt-get install openssh-client -y
RUN apt-get update
RUN apt-get install -y postgresql postgresql-client binutils libproj-dev gdal-bin

RUN pip install -r /tmp/requirements.txt
RUN pip install -r /tmp/requirements.dev.txt

COPY . /src

ENV PATH="/scripts:/py/bin:$PATH"

CMD ["gunicorn", "main:app", "--bind", "0.0.0.0:80","--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker"]
