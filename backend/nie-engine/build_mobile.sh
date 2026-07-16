#!/bin/bash
# ──────────────────────────────────────────────────────────────────────────────
# SmoothSwitch NIE Mobile SDK Build Script
#
# This script uses `gomobile` to compile the Go NIE engine into:
#   - Android: smoothswitch.aar  (JNI bindings)
#   - iOS:     SmoothSwitch.framework (Objective-C/Swift bindings)
#
# Prerequisites:
#   - Go 1.21+
#   - Android SDK + NDK (for Android builds)
#   - Xcode command-line tools (for iOS builds, macOS only)
#   - gomobile: go install golang.org/x/mobile/cmd/gomobile@latest
#   - gobind:   go install golang.org/x/mobile/cmd/gobind@latest
#
# Usage:
#   ./build_mobile.sh android     # Build .aar only
#   ./build_mobile.sh ios         # Build .framework only (macOS only)
#   ./build_mobile.sh all         # Build both
# ──────────────────────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="${SCRIPT_DIR}/build"

mkdir -p "${OUTPUT_DIR}"

echo "============================================"
echo "  SmoothSwitch NIE Mobile SDK Builder"
echo "============================================"

# Ensure gomobile is installed
if ! command -v gomobile &> /dev/null; then
    echo "Installing gomobile..."
    go install golang.org/x/mobile/cmd/gomobile@latest
    go install golang.org/x/mobile/cmd/gobind@latest
fi

echo "Initializing gomobile..."
gomobile init

TARGET="${1:-all}"

# ── Android Build ──────────────────────────────────────────────────────────
build_android() {
    echo ""
    echo "Building Android AAR..."
    echo "  Package: smoothswitch/nie-engine/mobile"
    echo "  Output:  ${OUTPUT_DIR}/smoothswitch.aar"
    echo ""

    gomobile bind \
        -target=android \
        -androidapi 21 \
        -o "${OUTPUT_DIR}/smoothswitch.aar" \
        -javapkg=com.smoothswitch.nie \
        smoothswitch/nie-engine/mobile

    echo ""
    echo "✅ Android build complete: ${OUTPUT_DIR}/smoothswitch.aar"
    echo ""
    echo "Integration steps:"
    echo "  1. Copy smoothswitch.aar to your Android project's app/libs/"
    echo "  2. In build.gradle: implementation files('libs/smoothswitch.aar')"
    echo "  3. Import: import com.smoothswitch.nie.Mobile;"
    echo "  4. Call:   String result = Mobile.startEngine(10);"
    echo ""
}

# ── iOS Build ──────────────────────────────────────────────────────────────
build_ios() {
    if [[ "$(uname)" != "Darwin" ]]; then
        echo "⚠️  iOS builds require macOS with Xcode. Skipping."
        return
    fi

    echo ""
    echo "Building iOS Framework..."
    echo "  Package: smoothswitch/nie-engine/mobile"
    echo "  Output:  ${OUTPUT_DIR}/SmoothSwitch.xcframework"
    echo ""

    gomobile bind \
        -target=ios \
        -o "${OUTPUT_DIR}/SmoothSwitch.xcframework" \
        smoothswitch/nie-engine/mobile

    echo ""
    echo "✅ iOS build complete: ${OUTPUT_DIR}/SmoothSwitch.xcframework"
    echo ""
    echo "Integration steps:"
    echo "  1. Drag SmoothSwitch.xcframework into your Xcode project"
    echo "  2. Import: import SmoothSwitch (Swift) or #import <SmoothSwitch/SmoothSwitch.h> (ObjC)"
    echo "  3. Call:   let result = MobileStartEngine(10)  (Swift)"
    echo ""
}

case "${TARGET}" in
    android)
        build_android
        ;;
    ios)
        build_ios
        ;;
    all)
        build_android
        build_ios
        ;;
    *)
        echo "Usage: $0 {android|ios|all}"
        exit 1
        ;;
esac

echo "============================================"
echo "  Build Complete"
echo "============================================"
