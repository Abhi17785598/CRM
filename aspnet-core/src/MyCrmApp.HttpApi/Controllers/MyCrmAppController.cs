using MyCrmApp.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace MyCrmApp.Controllers;

/* Inherit your controllers from this class.
 */
public abstract class MyCrmAppController : AbpControllerBase
{
    protected MyCrmAppController()
    {
        LocalizationResource = typeof(MyCrmAppResource);
    }
}
