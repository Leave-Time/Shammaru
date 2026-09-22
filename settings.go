package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

type Settings struct {
	Theme             string `json:"theme"`
	AutoSave          bool   `json:"autoSave"`
	DefaultProjectDir string `json:"defaultProjectDir"`
	EditorFontSize    int    `json:"editorFontSize"`
}

func defaultSettings() Settings { return Settings{Theme: "system", AutoSave: true, EditorFontSize: 14} }

func settingsPath() (string, error) {
	dir, err := os.UserConfigDir()
	if err != nil {
		return "", fmt.Errorf("resolve user config directory: %w", err)
	}
	return filepath.Join(dir, "Shammaru", "settings.json"), nil
}

func (a *App) GetSettings() (Settings, error) {
	path, err := settingsPath()
	if err != nil {
		return Settings{}, err
	}
	data, err := os.ReadFile(path)
	if errors.Is(err, os.ErrNotExist) {
		return defaultSettings(), nil
	}
	if err != nil {
		return Settings{}, fmt.Errorf("read settings: %w", err)
	}
	value := defaultSettings()
	if err := json.Unmarshal(data, &value); err != nil {
		return Settings{}, fmt.Errorf("decode settings: %w", err)
	}
	return normalizeSettings(value), nil
}

func (a *App) SaveSettings(value Settings) error {
	path, err := settingsPath()
	if err != nil {
		return err
	}
	value = normalizeSettings(value)
	data, err := json.MarshalIndent(value, "", "  ")
	if err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return err
	}
	temporary := path + ".tmp"
	if err := os.WriteFile(temporary, data, 0o600); err != nil {
		return err
	}
	return os.Rename(temporary, path)
}

func normalizeSettings(value Settings) Settings {
	if value.Theme != "light" && value.Theme != "dark" && value.Theme != "system" {
		value.Theme = "system"
	}
	if value.EditorFontSize < 10 || value.EditorFontSize > 24 {
		value.EditorFontSize = 14
	}
	value.DefaultProjectDir = strings.TrimSpace(value.DefaultProjectDir)
	return value
}
