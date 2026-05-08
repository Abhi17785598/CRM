using Volo.Abp.Modularity;

namespace MyCrmApp;

[DependsOn(
    typeof(MyCrmAppApplicationModule),
    typeof(MyCrmAppDomainTestModule)
)]
public class MyCrmAppApplicationTestModule : AbpModule
{

}
