using Volo.Abp.Account;
using Volo.Abp.Mapperly;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Identity;
using Volo.Abp.Modularity;
using Volo.Abp.PermissionManagement;
using Volo.Abp.SettingManagement;
using Volo.Abp.TenantManagement;
using Microsoft.Extensions.DependencyInjection;
using MyCrmApp.CRM;
using MyCrmApp.Payroll;

namespace MyCrmApp;

[DependsOn(
    typeof(MyCrmAppDomainModule),
    typeof(AbpAccountApplicationModule),
    typeof(MyCrmAppApplicationContractsModule),
    typeof(AbpIdentityApplicationModule),
    typeof(AbpPermissionManagementApplicationModule),
    typeof(AbpTenantManagementApplicationModule),
    typeof(AbpFeatureManagementApplicationModule),
    typeof(AbpSettingManagementApplicationModule)
    )]
public class MyCrmAppApplicationModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        context.Services.AddMapperlyObjectMapper<MyCrmAppApplicationModule>();
        
        // Register application services
        context.Services.AddTransient<CrmAppService>();
        context.Services.AddTransient<PayrollAppService>();
    }
}
