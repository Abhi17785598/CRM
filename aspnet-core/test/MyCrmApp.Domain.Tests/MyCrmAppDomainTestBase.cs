using Volo.Abp.Modularity;

namespace MyCrmApp;

/* Inherit from this class for your domain layer tests. */
public abstract class MyCrmAppDomainTestBase<TStartupModule> : MyCrmAppTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
