package document

import "testing"

func TestFormatFromExtension(t *testing.T) {
	cases := map[string]Format{"problem.md": Markdown, "problem.tex": Latex, "problem.typ": Typst}
	for source, expected := range cases {
		if actual := formatFromExtension(source); actual != expected {
			t.Fatalf("formatFromExtension(%q) = %q, want %q", source, actual, expected)
		}
	}
}
