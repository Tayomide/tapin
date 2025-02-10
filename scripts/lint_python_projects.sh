#!/bin/bash

# Function to lint all Python projects in the repository
lint_projects() {
  for project in $(find . -type f -name "requirements.txt" -exec dirname {} \; | sort | uniq); do
    echo "Linting project in $project"
    cd "$project"
    
    # Create and activate virtual environment
    python -m venv .venv

    # Check platform and activate virtual environment accordingly
    if [[ "$OSTYPE" == "linux-gnu"* || "$OSTYPE" == "darwin"* ]]; then
      # For Linux or Mac
      source .venv/bin/activate
    elif [[ "$OSTYPE" == "cygwin" || "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
      # For Windows
      source .venv/Scripts/activate
    else
      echo "Unsupported OS: $OSTYPE"
      exit 1
    fi
    
    # Install dependencies
    echo "Installing dependencies for $project"
    python -m pip -q install --upgrade pip
    pip -q install -r requirements.txt pylint || echo "Dependency installation failed for $project, skipping linting"

    # Run pylint
    if pylint $(find . -path ./\.venv -prune -o -type f -name "*.py" -print) --indent-string='  '; then
      echo -e "Linting succeeded for $project\n"
    else
      echo -e "Linting failed for $project, continuing to next project\n"
    fi
    
    # Deactivate and clean up
    deactivate
    cd -
  done
}

# Execute the linting function
lint_projects
