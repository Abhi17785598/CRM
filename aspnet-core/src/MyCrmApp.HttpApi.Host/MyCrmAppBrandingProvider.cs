using Microsoft.Extensions.Localization;
using MyCrmApp.Localization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace MyCrmApp;

[Dependency(ReplaceServices = true)]
public class MyCrmAppBrandingProvider : DefaultBrandingProvider
{
    private IStringLocalizer<MyCrmAppResource> _localizer;

    public MyCrmAppBrandingProvider(IStringLocalizer<MyCrmAppResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["AppName"];
}
