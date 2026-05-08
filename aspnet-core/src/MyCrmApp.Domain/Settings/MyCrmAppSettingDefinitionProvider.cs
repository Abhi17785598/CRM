using Volo.Abp.Settings;

namespace MyCrmApp.Settings;

public class MyCrmAppSettingDefinitionProvider : SettingDefinitionProvider
{
    public override void Define(ISettingDefinitionContext context)
    {
        //Define your own settings here. Example:
        //context.Add(new SettingDefinition(MyCrmAppSettings.MySetting1));
    }
}
