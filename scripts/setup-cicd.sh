#!/bin/bash

# GitOps Setup Script
# This script helps configure GitHub secrets for CI/CD

set -e

echo "🚀 GitOps CI/CD Setup"
echo "====================="
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed"
    echo "Please install it from: https://cli.github.com/"
    exit 1
fi

# Check if logged in to GitHub CLI
if ! gh auth status &> /dev/null; then
    echo "❌ Not logged in to GitHub CLI"
    echo "Please run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is installed and authenticated"
echo ""

# Function to set secret
set_secret() {
    local secret_name=$1
    local secret_description=$2
    
    echo "📝 Setting: $secret_name"
    echo "   Description: $secret_description"
    read -sp "   Enter value: " secret_value
    echo ""
    
    if [ -n "$secret_value" ]; then
        gh secret set "$secret_name" --body "$secret_value"
        echo "   ✅ Set successfully"
    else
        echo "   ⚠️  Skipped (empty value)"
    fi
    echo ""
}

echo "Setting up Vercel secrets..."
echo "=============================="
set_secret "VERCEL_TOKEN" "Vercel authentication token"
set_secret "VERCEL_ORG_ID" "Vercel organization ID"
set_secret "VERCEL_PROJECT_ID" "Vercel project ID"

echo ""
echo "Setting up Supabase Production secrets..."
echo "=========================================="
set_secret "SUPABASE_ACCESS_TOKEN" "Supabase CLI access token"
set_secret "PRODUCTION_SUPABASE_PROJECT_REF" "Production Supabase project reference"
set_secret "NEXT_PUBLIC_SUPABASE_URL" "Production Supabase URL"
set_secret "NEXT_PUBLIC_SUPABASE_ANON_KEY" "Production Supabase anon key"
set_secret "SUPABASE_SERVICE_KEY" "Production Supabase service role key"

echo ""
echo "Setting up Supabase Staging secrets..."
echo "======================================="
set_secret "STAGING_SUPABASE_PROJECT_REF" "Staging Supabase project reference"
set_secret "STAGING_SUPABASE_URL" "Staging Supabase URL"
set_secret "STAGING_SUPABASE_ANON_KEY" "Staging Supabase anon key"
set_secret "STAGING_SUPABASE_SERVICE_KEY" "Staging Supabase service role key"

echo ""
echo "Setting up Database secrets..."
echo "=============================="
set_secret "DATABASE_URL" "Production database connection string"
set_secret "DIRECT_URL" "Production direct database connection"
set_secret "STAGING_DATABASE_URL" "Staging database connection string"
set_secret "STAGING_DIRECT_URL" "Staging direct database connection"

echo ""
echo "Setting up Payment secrets..."
echo "=============================="
set_secret "LEMON_SQUEEZY_API_KEY" "LemonSqueezy API key"
set_secret "LEMON_SQUEEZY_STORE_ID" "LemonSqueezy store ID"
set_secret "LEMON_SQUEEZY_SUBSCRIPTION_VARIANT_ID" "LemonSqueezy subscription variant ID"

echo ""
echo "Setting up Security & Monitoring secrets..."
echo "==========================================="
set_secret "SNYK_TOKEN" "Snyk security scanning token (optional)"
set_secret "CODECOV_TOKEN" "Codecov coverage token (optional)"

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Verify secrets at: https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/settings/secrets/actions"
echo "2. Review workflows in .github/workflows/"
echo "3. Push code to trigger CI/CD pipeline"
echo ""
