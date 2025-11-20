// Module
export * from './category.module';

// Re-export application layer (public API)
export * from './application';

// Re-export domain layer (public API)
export * from './domain';

// Infrastructure is typically NOT exported (internal implementation)
// Only export if other modules need direct access to repositories/controllers
