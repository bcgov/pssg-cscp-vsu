using System.Threading.Tasks;

namespace Gov.Cscp.Victims.Public.Shared.Database;

public interface ITokenProvider
{
    Task<string> AcquireToken();
}
