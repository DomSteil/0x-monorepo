after('generate coverage report', async () => {
    await (global as any).__coverage_subprovider__.writeCoverageAsync();
});
