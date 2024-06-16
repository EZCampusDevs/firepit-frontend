
.PHONY: dev prettier


dev:
	pnpm dev

prettier:
	pnpm exec prettier . --write
