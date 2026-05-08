using System;
using System.Collections.Generic;
using System.Text;
using MyCrmApp.Localization;
using Volo.Abp.Application.Services;

namespace MyCrmApp;

/* Inherit your application services from this class.
 */
public abstract class MyCrmAppAppService : ApplicationService
{
    protected MyCrmAppAppService()
    {
        LocalizationResource = typeof(MyCrmAppResource);
    }
}
