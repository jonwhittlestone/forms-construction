.PHONY: run check-yarn check-env

check-yarn:
	@which yarn > /dev/null || (echo "Error: yarn is not installed" && exit 1)

check-env:
	@if [ ! -f ".env" ]; then \
		echo "Error: .env file is missing"; \
		echo "Please create .env and populate required environment variables"; \
		exit 1; \
	fi

node_modules:
	yarn install

run: check-yarn check-env
	@if [ ! -d "node_modules" ]; then \
		yarn install; \
	fi
	yarn dev