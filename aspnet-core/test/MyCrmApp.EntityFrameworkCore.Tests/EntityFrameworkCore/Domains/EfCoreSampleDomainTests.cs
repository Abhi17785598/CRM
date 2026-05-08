using MyCrmApp.Samples;
using Xunit;

namespace MyCrmApp.EntityFrameworkCore.Domains;

[Collection(MyCrmAppTestConsts.CollectionDefinitionName)]
public class EfCoreSampleDomainTests : SampleDomainTests<MyCrmAppEntityFrameworkCoreTestModule>
{

}
