import Menu from '@mui/icons-material/Menu';
import { AppBar, Container, IconButton, Theme, Toolbar, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTranslation } from 'next-i18next';

import { CtfNavigationGql } from '@src/components/features/ctf-components/ctf-navigation/ctf-navigation-gql';
import { Link } from '@src/components/shared/link';
import Image from 'next/image';
import { HEADER_HEIGHT, HEADER_HEIGHT_MD, CONTAINER_WIDTH } from '@src/theme';

const useStyles = makeStyles((theme: Theme) => ({
  appbar: {
    boxShadow: '0 2px 6px #00000021',
  },
  toolbar: {
    height: HEADER_HEIGHT_MD,
    [theme.breakpoints.up('md')]: {
      height: HEADER_HEIGHT,
    },
  },
  toolbarContent: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'block',
    maxWidth: '120px',
    height: 'auto',
  },
  menuWrapper: {
    alignItems: 'center',
    display: 'flex',
  },
  accountMenu: {
    alignItems: 'center',
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },

  accountMenuItem: {
    '& + &': {
      marginLeft: theme.spacing(8),

      [theme.breakpoints.up('lg')]: {
        marginLeft: theme.spacing(10),
      },
    },
    '& .MuiButton-startIcon': {
      marginRight: '0.4rem',
    },
    '& .MuiButton-iconSizeSmall > :first-child': {
      fontSize: '1.5rem',
    },
  },
  corporateLogo: {
    display: 'block',
    width: '113px',
    height: '40px',
    position: 'relative',
    overflow: 'hidden',
  },
  logoLink: {
    display: 'block',
  },
}));

interface HeaderPropsInterface {
  isMenuOpen?: boolean;
  onMenuClick?: () => any;
}

export const Header = (props: HeaderPropsInterface) => {
  const { t } = useTranslation();

  const { onMenuClick, isMenuOpen } = props;
  const classes = useStyles();

  return (
    <AppBar position="sticky" color="secondary" className={classes.appbar}>
      <Toolbar>
        <Container
          className={classes.toolbarContent}
          disableGutters
          maxWidth={false}
          style={{
            maxWidth: `${CONTAINER_WIDTH / 10}rem`,
          }}
        >
          <Link href="/" withoutMaterial title={t('common.homepage')} className={classes.logoLink}>
            <Box component="div" className={classes.corporateLogo}>
              <Image
                src="/icons/FORMS_Logo_TRANSPARANT_SCREEN_FINAL.png"
                alt="FORMS Construction"
                width={113}
                height={40}
                layout="responsive"
                objectFit="contain"
                quality={95}
                priority
                unoptimized
              />
            </Box>
          </Link>
          <Box display={{ xs: 'none', md: 'block' }}>
            <div className={classes.menuWrapper}>
              <CtfNavigationGql />
            </div>
          </Box>
        </Container>

        {/* menu button */}
        <Box display={{ md: 'none' }}>
          <IconButton
            title={t('navigation.mobileMenuButton')}
            onClick={() => onMenuClick?.()}
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
            aria-haspopup="dialog"
          >
            <Menu />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
