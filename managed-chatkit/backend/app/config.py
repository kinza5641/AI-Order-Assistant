"""Environment configuration and validation for ChatKit backend."""

import os
import sys
from typing import Optional


class ConfigError(Exception):
    """Raised when required configuration is missing or invalid."""

    pass


def get_openai_api_key() -> str:
    """Get and validate OpenAI API key.
    
    Returns:
        The OpenAI API key
        
    Raises:
        ConfigError: If API key is missing or invalid
    """
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if not api_key:
        raise ConfigError(
            "Missing OPENAI_API_KEY environment variable. "
            "Set it in .env.local or your shell environment. "
            "Get a key from: https://platform.openai.com/account/api-keys"
        )
    if not api_key.startswith("sk-"):
        raise ConfigError(
            f"Invalid OPENAI_API_KEY format. "
            f"Expected to start with 'sk-', got '{api_key[:10]}...'"
        )
    return api_key


def get_chatkit_api_base() -> str:
    """Get ChatKit API base URL with fallback.
    
    Returns:
        The ChatKit API base URL
    """
    return (
        os.getenv("CHATKIT_API_BASE")
        or os.getenv("VITE_CHATKIT_API_BASE")
        or "https://api.openai.com"
    )


def get_workflow_id_from_env() -> Optional[str]:
    """Get default workflow ID from environment.
    
    Returns:
        The workflow ID if set, None otherwise
    """
    workflow_id = (
        os.getenv("CHATKIT_WORKFLOW_ID")
        or os.getenv("VITE_CHATKIT_WORKFLOW_ID")
    )
    return workflow_id.strip() if workflow_id else None


def is_production() -> bool:
    """Check if running in production mode.
    
    Returns:
        True if ENVIRONMENT or NODE_ENV is set to 'production'
    """
    env = (os.getenv("ENVIRONMENT") or os.getenv("NODE_ENV") or "").lower()
    return env == "production"


def validate_config(strict: bool = False) -> dict:
    """Validate and return configuration.
    
    Args:
        strict: If True, require VITE_CHATKIT_WORKFLOW_ID to be set
        
    Returns:
        Dictionary with validated config
        
    Raises:
        ConfigError: If required config is missing or invalid
    """
    config = {
        "api_key": get_openai_api_key(),
        "api_base": get_chatkit_api_base(),
        "workflow_id": get_workflow_id_from_env(),
        "is_prod": is_production(),
    }

    if strict and not config["workflow_id"]:
        raise ConfigError(
            "Missing VITE_CHATKIT_WORKFLOW_ID environment variable. "
            "Set it in .env.local or your shell environment. "
            "Get a workflow ID from OpenAI Agent Builder (starts with 'wf_')."
        )

    return config


def print_config_info():
    """Print configuration info for debugging (no sensitive values)."""
    try:
        config = validate_config()
        print("\n✓ ChatKit Backend Configuration:")
        print(f"  API Base: {config['api_base']}")
        print(f"  Default Workflow ID: {'Set' if config['workflow_id'] else 'Not set (will use request value)'}")
        print(f"  Production Mode: {config['is_prod']}")
        print()
    except ConfigError as e:
        print(f"\n✗ Configuration Error: {e}\n")
        sys.exit(1)
