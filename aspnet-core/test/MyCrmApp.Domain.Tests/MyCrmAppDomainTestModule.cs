using Volo.Abp.Modularity;

namespace MyCrmApp;

[DependsOn(
    typeof(MyCrmAppDomainModule),
    typeof(MyCrmAppTestBaseModule)
)]
public class MyCrmAppDomainTestModule : AbpModule
{

}
