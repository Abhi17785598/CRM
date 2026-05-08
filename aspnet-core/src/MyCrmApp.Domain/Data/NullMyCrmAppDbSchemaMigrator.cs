using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace MyCrmApp.Data;

/* This is used if database provider does't define
 * IMyCrmAppDbSchemaMigrator implementation.
 */
public class NullMyCrmAppDbSchemaMigrator : IMyCrmAppDbSchemaMigrator, ITransientDependency
{
    public Task MigrateAsync()
    {
        return Task.CompletedTask;
    }
}
