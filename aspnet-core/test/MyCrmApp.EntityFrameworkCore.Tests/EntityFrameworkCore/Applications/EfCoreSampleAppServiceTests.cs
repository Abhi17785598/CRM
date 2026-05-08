using MyCrmApp.Samples;
using Xunit;

namespace MyCrmApp.EntityFrameworkCore.Applications;

[Collection(MyCrmAppTestConsts.CollectionDefinitionName)]
public class EfCoreSampleAppServiceTests : SampleAppServiceTests<MyCrmAppEntityFrameworkCoreTestModule>
{

}
