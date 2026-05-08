using Volo.Abp.Modularity;

namespace MyCrmApp;

public abstract class MyCrmAppApplicationTestBase<TStartupModule> : MyCrmAppTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
