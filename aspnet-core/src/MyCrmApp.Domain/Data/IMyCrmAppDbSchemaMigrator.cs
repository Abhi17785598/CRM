using System.Threading.Tasks;

namespace MyCrmApp.Data;

public interface IMyCrmAppDbSchemaMigrator
{
    Task MigrateAsync();
}
