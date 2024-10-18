# syntax=docker/dockerfile:1

# Supports ARM + x86-64
FROM node:18 as base

# Install zshell and locales
RUN apt-get update && apt-get install -y zsh locales

SHELL ["/bin/zsh", "-c"]

# Set correct locale
RUN locale-gen en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8

# Create a non-root user and set up their home directory
RUN useradd -m -s /bin/zsh appuser

# Set the working directory
WORKDIR /home/appuser/app

# Ensure the app directory is owned by appuser
RUN chown appuser:appuser /home/appuser/app

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Change to non-root user
USER appuser

# Copy package files with correct ownership
COPY --chown=appuser:appuser ["package.json", "package-lock.json", "./"]

# Referring to base, and adding new build stage label 'dev'
FROM base as dev

# Copy the rest of the application files
COPY --chown=appuser:appuser . .

# The working directory is already set to /home/appuser/app in the base stage
