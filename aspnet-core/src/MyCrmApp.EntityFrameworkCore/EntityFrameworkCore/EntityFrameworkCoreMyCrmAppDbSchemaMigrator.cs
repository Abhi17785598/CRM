using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using MyCrmApp.Data;
using Volo.Abp.DependencyInjection;

namespace MyCrmApp.EntityFrameworkCore;

public class EntityFrameworkCoreMyCrmAppDbSchemaMigrator
    : IMyCrmAppDbSchemaMigrator, ITransientDependency
{
    private readonly IServiceProvider _serviceProvider;

    public EntityFrameworkCoreMyCrmAppDbSchemaMigrator(
        IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task MigrateAsync()
    {
        /* We intentionally resolve the MyCrmAppDbContext
         * from IServiceProvider (instead of directly injecting it)
         * to properly get the connection string of the current tenant in the
         * current scope.
         */

        await _serviceProvider
            .GetRequiredService<MyCrmAppDbContext>()
            .Database
            .MigrateAsync();
    }
}
