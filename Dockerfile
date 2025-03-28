FROM ruby:3.0.2

# Install dependencies
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential git libsqlite3-dev nodejs npm

# Set up working directory
WORKDIR /app

# Set development environment
ENV RAILS_ENV="development"

# Install gems
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Copy application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Entrypoint script
COPY bin/docker-entrypoint /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint

ENTRYPOINT ["docker-entrypoint"]

# Start Rails server
CMD ["rails", "server", "-b", "0.0.0.0"]
